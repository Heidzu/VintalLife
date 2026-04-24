# VintalLife API examples

## Health check

```bash
curl http://localhost:5000/api/health
```

## Create a contact request

```bash
curl -X POST http://localhost:5000/api/requests \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Iryna Koval",
    "phone": "+380991112233",
    "source": "modal",
    "message": "Need a kitchen estimate for a studio apartment."
  }'
```

## Get all contact requests

```bash
curl http://localhost:5000/api/requests
```

## Upload a photo

```bash
curl -X POST http://localhost:5000/api/photos \
  -F "title=Modern white kitchen" \
  -F "description=Project from 2026 collection" \
  -F "category=minimalism" \
  -F "image=@C:/images/kitchen.jpg"
```

## Get all photos

```bash
curl http://localhost:5000/api/photos
```

## Download a photo by id

```bash
curl -L http://localhost:5000/api/photos/PHOTO_ID/download --output kitchen.jpg
```

## Delete a photo by id

```bash
curl -X DELETE http://localhost:5000/api/photos/PHOTO_ID
```