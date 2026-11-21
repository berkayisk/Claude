#!/usr/bin/env bash
# Akşam + röportaj kliplerini yeni kuralla (kayıtlı izlerden) yeniden kodla, iki işçi
cd "$(dirname "$0")/.."
A="7439 7420 7428 7393 7395 7397 7399 7400 7402 7404 7406 7407"
B="7485 7441 7440 7459 7461 7408 7412 7424 7470 7471 7474 7476"
python3 -u calisma/vekil.py --yeniden --zorla $A 2>&1 | grep --line-buffered -v WARN >> calisma/yuz/vekil_log.txt &
python3 -u calisma/vekil.py --yeniden --zorla $B 2>&1 | grep --line-buffered -v WARN >> calisma/yuz/vekil_log.txt &
wait; echo AKSAM BITTI
