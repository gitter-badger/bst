export class HTTPChunk {
    public length: number;
    public data: Buffer;

    public static parse (body: Buffer): Array<HTTPChunk> {
        // let packetLengthEnd = body.find(function())
        return null;
    }

    // Find the specified value within the buffer
    private static scan(body: Buffer, value: number): number {
        return 0;
    }
}