# recebe os arquivos do exportador (POST /<nome>) e grava na pasta dada
import http.server, os, sys
DEST = sys.argv[1]; PORTA = int(sys.argv[2]) if len(sys.argv) > 2 else 8765
class H(http.server.BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header('Access-Control-Allow-Origin', '*'); self.send_header('Access-Control-Allow-Headers', '*'); self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
    def do_OPTIONS(self):
        self.send_response(204); self._cors(); self.end_headers()
    def do_POST(self):
        nome = os.path.basename(self.path.strip('/'))
        n = int(self.headers.get('Content-Length', 0)); dados = self.rfile.read(n)
        with open(os.path.join(DEST, nome), 'wb') as f: f.write(dados)
        print('gravado', nome, len(dados), flush=True)
        self.send_response(200); self._cors(); self.end_headers(); self.wfile.write(b'ok')
http.server.ThreadingHTTPServer(('127.0.0.1', PORTA), H).serve_forever()
