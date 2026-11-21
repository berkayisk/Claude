#!/usr/bin/env bash
# Tüm gerekli klipler için vekil üretimi, iki işçi (biri baştan, biri sondan; kilit dosyasıyla çakışmaz)
cd "$(dirname "$0")/.."
L="7356 7357 7353 7359 7360 7361 7363 7364 7365 7366 7367 7368 7369 7380 7381 7382 7383 7387 7392 7470 7471 7474 7476 7485 7393 7395 7397 7399 7400 7402 7404 7406 7407 7408 7412 7420 7424 7428 7439 7440 7441 7459 7461"
R=$(echo $L | tr ' ' '\n' | tac | tr '\n' ' ')
python3 -u calisma/vekil.py $L 2>&1 | grep --line-buffered -v WARN >> calisma/yuz/vekil_log.txt &
sleep 5
python3 -u calisma/vekil.py $R 2>&1 | grep --line-buffered -v WARN >> calisma/yuz/vekil_log.txt &
wait; echo HEPSI BITTI
