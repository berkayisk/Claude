#!/bin/bash
# her ses ayrı klasöre, kendi referansı ve perdesiyle
cd "$(dirname "$0")"; K="/home/user/Claude/Claude video"; S="$K/musteriler/dogal-yasam-rotasi/marka/sesler"
for v in anlatici elif arkadas doktor eczaci; do
  f0=$(python3 -c "import json;print(json.load(open('$S/sesler.json'))['$v']['f0'])")
  SES_REF="$S/${v}_referans.wav" SES_F0=$f0 HF_HUB_DISABLE_XET=1 python3 "$K/araclar/berkay_ses.py" satirlar_$v.json ciktilar/$v 2>&1 | grep -v -i warn
done
