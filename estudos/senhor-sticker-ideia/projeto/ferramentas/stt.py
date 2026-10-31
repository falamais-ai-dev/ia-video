import os, sys, json, subprocess
r = subprocess.run(["curl","-sS","https://api.elevenlabs.io/v1/speech-to-text","-H","xi-api-key: "+os.environ["ELEVENLABS_API_KEY"],"-F","model_id=scribe_v1","-F","language_code=pt","-F","file=@"+sys.argv[1]],capture_output=True,text=True)
d=json.loads(r.stdout); print(d.get("text", d))
