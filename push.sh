api_key=AIzaSyCtONLcLW-JT18mf3CbmOE62en0Gf-7mzw
registration_id=fijROHtFtbM:APA91bGq2XvVukhpqjTn8OGZFZi6ReaL9FIomcHLp4vvGyrmIHMlvL6DtEQ8XJR_m-CIaIH3cUtbZPwlpkeDPKmMxU_BqWLsXUgiiz9AOxiaXjZ7JvmaZJEZagQxw6g1-Swfwj7yUST3

curl --header "Authorization: key=$api_key" --header Content-Type:"application/json" https://fcm.googleapis.com/fcm/send -d "{\"registration_ids\":[\"$registration_id\"]}"
