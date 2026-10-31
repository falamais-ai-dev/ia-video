import os, sys, json, base64, urllib.request
txt = open(sys.argv[1]).read().strip(); out = sys.argv[2]
body = json.dumps({"text": txt, "model_id": "eleven_v4", "language_code": "pt", "voice_settings": {"stability": 0.5}}).encode()
req = urllib.request.Request("https://api.elevenlabs.io/v1/text-to-speech/JBFqnCBsd6RMkjVDRZzb/with-timestamps?output_format=mp3_44100_128", data=body, headers={"xi-api-key": os.environ["ELEVENLABS_API_KEY"], "Content-Type": "application/json"})
r = urllib.request.urlopen(req, timeout=300)
print("character-cost:", r.headers.get("character-cost"))
d = json.loads(r.read())
open(out + ".mp3", "wb").write(base64.b64decode(d["audio_base64"]))
json.dump(d["alignment"], open(out + ".align.json", "w"))
