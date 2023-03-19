# HarperDB Okta Authorization

This package is an Okta Authorization validator for a HarperDB Custom Function. 

# How to use

Pass in JWT from Okta as part of the request to HarperDB endpoint:

```
curl -X POST http://127.0.0.1:9926/okta/dev/dog \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <okta-token-here>' \
  -d '{"records":[{"id":1, "dog_name": "doge"}]}'
```