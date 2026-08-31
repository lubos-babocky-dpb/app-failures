import { Html5Qrcode } from 'html5-qrcode';

export class ReportableAssetQrScanner {
    #html5QrCode = null;

    constructor(elementId) {
        this.elementId = elementId;
    }

    async scan() {
        if (this.#html5QrCode?.isScanning) {
            throw new Error('QR scanner is already running.');
        }

        this.#html5QrCode = new Html5Qrcode(this.elementId);

        return new Promise(async (resolve, reject) => {
            try {
                await this.#html5QrCode.start(
                    { facingMode: 'environment' },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0,
                    },
                    async (decodedText) => {
                        try {
                            await this.stop();
                            resolve(decodedText);
                        } catch (error) {
                            reject(error);
                        }
                    },
                );
            } catch (error) {
                await this.stop();
                reject(error);
            }
        });
    }

    async stop() {
        if (!this.#html5QrCode) {
            return;
        }

        try {
            if (this.#html5QrCode.isScanning) {
                await this.#html5QrCode.stop();
            }
        } finally {
            this.#html5QrCode = null;
        }
    }
}