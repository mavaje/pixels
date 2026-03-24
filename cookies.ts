
export class Cookies {

    static save(name: string, value: any) {
        document.cookie = `${name}=${value}`;
    }

    static load(name: string): string {
        for (const cookie of document.cookie.split(/;\s*/g)) {
            const [key, value] = cookie.split('=');
            if (key === name) return value;
        }
        return null;
    }
}
