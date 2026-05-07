import http.server
import socketserver

PORT = 3456

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(('', PORT), Handler) as httpd:
    print(f"Serving at port {PORT}")
    httpd.serve_forever()