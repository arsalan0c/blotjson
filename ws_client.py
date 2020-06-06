import asyncio
import websocket


async def message():
    async with websocket.connect('ws://localhost:9101') as socket:
        msg = input("what do you want to send: ")
        await socket.send(msg)
        print(await socket.recv())


asyncio.get_event_loop().run_until_complete(message())
