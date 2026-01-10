/**
 * Minimal SMTP Client for Deno (Edge Runtime Compatible)
 * Does NOT rely on 'net' or 'dns' from Node.
 * Uses Deno.connectTls
 */

export class SmtpClient {
    conn: Deno.TlsConn | null = null;

    async connectTLS(options: { hostname: string; port: number; username?: string; password?: string }) {
        this.conn = await Deno.connectTls({
            hostname: options.hostname,
            port: options.port,
        });

        // Initial handshake
        await this.readResponse();

        await this.sendCommand("EHLO localhost");

        if (options.username && options.password) {
            await this.sendCommand("AUTH LOGIN");
            await this.sendCommand(btoa(options.username));
            await this.sendCommand(btoa(options.password));
        }
    }

    async send(options: { from: string; to: string; subject: string; content: string }) {
        if (!this.conn) throw new Error("Not connected");

        await this.sendCommand(`MAIL FROM: <${options.from}>`);
        await this.sendCommand(`RCPT TO: <${options.to}>`);
        await this.sendCommand("DATA");

        const message = `From: ${options.from}\r\n` +
            `To: ${options.to}\r\n` +
            `Subject: ${options.subject}\r\n` +
            `MIME-Version: 1.0\r\n` +
            `Content-Type: text/html; charset=utf-8\r\n` +
            `\r\n` +
            `${options.content}\r\n` +
            `.`;

        await this.sendCommand(message);
    }

    async close() {
        if (this.conn) {
            try {
                await this.sendCommand("QUIT");
            } catch (e) {
                // ignore
            }
            this.conn.close();
        }
    }

    private async sendCommand(command: string) {
        if (!this.conn) throw new Error("Not connected");

        const encoder = new TextEncoder();
        const data = encoder.encode(command + "\r\n");

        // Replaces Deno.writeAll
        let written = 0;
        while (written < data.length) {
            written += await this.conn.write(data.subarray(written));
        }

        const res = await this.readResponse();
        // Basic error checking
        if (res.startsWith("4") || res.startsWith("5")) {
            throw new Error(`SMTP Error: ${res}`);
        }
    }

    private async readResponse(): Promise<string> {
        if (!this.conn) throw new Error("Not connected");

        // Simple line reader
        const buf = new Uint8Array(1024);
        let response = "";

        while (true) {
            const n = await this.conn.read(buf);
            if (n === null) break;
            response += new TextDecoder().decode(buf.subarray(0, n));
            if (response.includes("\r\n")) break;
        }

        return response.trim();
    }
}
