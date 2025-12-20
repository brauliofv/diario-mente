// js/driveService.js
import { GOOGLE_CLIENT_ID } from './constants.js';

const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/drive.file";
const FILENAME = 'neurolog_backup.json';

let tokenClient;
let gapiInited = false;
let gisInited = false;

export const DriveService = {
    init: (callback) => {
        if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.includes('TU_CLIENT_ID')) {
            console.warn("Google Drive: Client ID no configurado.");
            return;
        }

        const gapi = window.gapi;
        const google = window.google;

        if (!gapi || !google) return;

        gapi.load("client", async () => {
            await gapi.client.init({ discoveryDocs: DISCOVERY_DOCS });
            gapiInited = true;
            if (gisInited) callback(true);
        });

        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: SCOPES,
            callback: '', // Se define al llamar
        });
        gisInited = true;
        if (gapiInited) callback(true);
    },

    signIn: () => {
        return new Promise((resolve, reject) => {
            tokenClient.callback = async (resp) => {
                if (resp.error) reject(resp);
                resolve(resp);
            };
            tokenClient.requestAccessToken({ prompt: 'consent' });
        });
    },

    sync: async (localHistory) => {
        try {
            // 1. Buscar archivo
            const response = await window.gapi.client.drive.files.list({
                q: `name = '${FILENAME}' and trashed = false`,
                fields: 'files(id, name)',
                spaces: 'drive',
            });
            const files = response.result.files;
            let fileId = files.length > 0 ? files[0].id : null;
            let cloudData = [];

            // 2. Leer datos nube
            if (fileId) {
                const res = await window.gapi.client.drive.files.get({
                    fileId: fileId,
                    alt: 'media',
                });
                cloudData = res.result || [];
            }

            // 3. Merge (Local gana si es conflicto simple, o unión por ID)
            const mergedMap = new Map();
            cloudData.forEach(item => mergedMap.set(item.id, item));
            localHistory.forEach(item => mergedMap.set(item.id, { ...item, synced: true })); // Marcar local como sync

            const mergedArray = Array.from(mergedMap.values()).sort((a, b) => b.timestamp - a.timestamp);

            // 4. Subir
            const fileContent = JSON.stringify(mergedArray);
            const file = new Blob([fileContent], { type: 'application/json' });
            const metadata = { name: FILENAME, mimeType: 'application/json' };

            const accessToken = window.gapi.client.getToken().access_token;
            const form = new FormData();
            form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
            form.append('file', file);

            const url = fileId
                ? `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`
                : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
            const method = fileId ? 'PATCH' : 'POST';

            await fetch(url, {
                method: method,
                headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
                body: form,
            });

            return mergedArray;

        } catch (error) {
            console.error("Error en Sync:", error);
            if (error.result && error.result.error) {
                throw new Error(`Google Drive Error: ${error.result.error.message}`);
            } else if (error.status === 401 || error.status === 403) {
                throw new Error("Error de autorización. Por favor, inicia sesión nuevamente.");
            } else {
                throw error;
            }
        }
    }
};