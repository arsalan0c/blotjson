import asyncio
import websockets
import json

##check if file is json
def is_json(my_json):
    try:
        json_object=json.loads(my_json)
    except ValueError as e:
        return False
    return True

async def response(websocket, path):
    message = await websocket.recv()
    print(f"we got the message from the client!: {message}")
    await websocket.send("I can confirm I got your message!")
if __name__ = '__main__':
    start_server = websockets.serve(response, 'localhost', 1234)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()


