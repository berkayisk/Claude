#!/usr/bin/env bash
# A: bitmiş klipler kayıtlı izlerden yeniden karar (komşu kimlik) + yeniden kodlama; B: kalanlar sıfırdan
cd "$(dirname "$0")/.."
A="7356 7357 7353 7359 7360 7361 7363 7364 7365 7366 7440 7441 7459 7461"
B="7367 7368 7369 7380 7381 7382 7383 7387 7392 7470 7471 7474 7476 7485 7393 7395 7397 7399 7400 7402 7404 7406 7407 7408 7412 7420 7424 7428 7439"
python3 -u calisma/vekil.py --yeniden --zorla $A 2>&1 | grep --line-buffered -v WARN >> calisma/yuz/vekil_log.txt &
python3 -u calisma/vekil.py $B 2>&1 | grep --line-buffered -v WARN >> calisma/yuz/vekil_log.txt &
wait; echo HEPSI BITTI
