
const API_URL = 'http://20.244.56.144/evaluation-service/logs';


export async function log(
    stack: string, 
    level: string, 
    pkg: string, 
    message: string
): Promise<void> {

   
    try {
        
        
        const authToken ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhamhhMmswNEBnbWFpbC5jb20iLCJleHAiOjE3NTU1ODcyNDEsImlhdCI6MTc1NTU4NjM0MSwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImY4MjA0OTdhLTBmNmItNGIyMi1iNWUzLTUyM2Y4NTNiNTJiNCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImFkaXR5YSBrdW1hciBqaGEiLCJzdWIiOiI0MWJjNTg4YS01M2JiLTRjYTctYjBhZi02NjFhOTEzNGVhOTYifSwiZW1haWwiOiJhamhhMmswNEBnbWFpbC5jb20iLCJuYW1lIjoiYWRpdHlhIGt1bWFyIGpoYSIsInJvbGxObyI6IjExNjAwMzIyMDA5IiwiYWNjZXNzQ29kZSI6IlV3VmZKeiIsImNsaWVudElEIjoiNDFiYzU4OGEtNTNiYi00Y2E3LWIwYWYtNjYxYTkxMzRlYTk2IiwiY2xpZW50U2VjcmV0Ijoia25KakpEeGFBQ3FLZHJVZCJ9.I_8nqVFLmTkFR7Rmw1iPwxfnMjQtXHUJ5n6x59VFlXk'; 

       
        const logData = {
            stack: stack,
            level: level,
            package: pkg,
            message: message,
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            
            headers: {
                
                'Content-Type': 'application/json',

                'Authorization': `Bearer ${authToken}`,
            },
            

            body: JSON.stringify(logData),
        });

     
        if (!response.ok) {
            console.error('Failed to send log. Server responded with an error:', response.status);
            return; 
        }

        const result = await response.json();
        console.log('Log sent successfully! Server responded with Log ID:', result.logID);

    } catch (error) {
        console.error('An error occurred while trying to send the log:', error);
    }
}
