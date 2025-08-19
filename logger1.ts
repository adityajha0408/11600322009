type LogLevel = "info" | "error" | "warn" | "debug" | "fatal";
type LogStack = "backend" | "frontend";
type LogPackage = "service" | "controller" | "db" | "route";

export async function log(
    stack: LogStack,
    level: LogLevel,
    pkg: LogPackage,
    message: string,
    metadata?: object
): Promise<void> {
    const logEntry = {
        timestamp: new Date().toISOString(),
        stack,
        level,
        package: pkg,
        message,
        ...metadata,
    };
    console.log(JSON.stringify(logEntry));
    // In a real scenario, this would make an API call to a logging service.
}