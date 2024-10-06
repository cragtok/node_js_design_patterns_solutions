#!/bin/bash

set -f
read -r -d '' CODE << EOF
function factorial(num){
    if(num<=1) {
        return 1;
    }
    return num * factorial(num-1);
}
EOF




NAME='factorial'
ARGUMENTS='1,2,\"hello\"'
ARGUMENTS='10'
DATA="{\"code\": \"$CODE\", \"name\": \"$NAME\", \"args\":\"${ARGUMENTS}\"}"
DATA=$(echo $DATA | jq)

echo $DATA



# for i in $(seq 1 10);
# do
#     curl --data "$DATA" --header 'Content-Type: application/json' http://localhost:8000
# done


curl --data "$DATA" --header 'Content-Type: application/json' http://localhost:8000
set f
