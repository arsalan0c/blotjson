import asyncio
import websocket


async def response(websocket, path):
    message = await websocket.recv()
    print(f"we got the message from the client!: {message}")
    await websocket.send("I can confirm I got your message!")

start_server = websocket.serve(response, 'localhost', 9101)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()


