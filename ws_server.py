import asyncio
import websockets
import json


async def response(websocket, path):
    message = await websocket.recv()
    print(f"we got the message from the client!: {message}")
    await websocket.send("I can confirm I got your message!")

start_server = websockets.serve(response, 'localhost', 1234)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()


