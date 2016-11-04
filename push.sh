api_key=AIzaSyCtONLcLW-JT18mf3CbmOE62en0Gf-7mzw
registration_id=ezALIquWABQ:APA91bGX_dHFubzbrk0fHcyKolC34YzBc_WbcoW7_1lA_Ns22aPwDQhRmwextUjI1teEroelF9lrXWkusXfF3oSGXPrN4aV0cPszSRyuk8yTEK1ZgI46D5OPaSLLQG0Q8fVazebmUpoe

curl --header "Authorization: key=$api_key" --header Content-Type:"application/json" https://fcm.googleapis.com/fcm/send -d "{\"registration_ids\":[\"$registration_id\"]}"
