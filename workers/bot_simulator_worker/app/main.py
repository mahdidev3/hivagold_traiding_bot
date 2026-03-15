from fastapi import FastAPI

app = FastAPI(title='Bot Simulator Worker', version='1.0.0')
state = {'portfolios': {}, 'orders': {}, 'prices': {'xag': 8000.0}}

@app.get('/health')
async def health():
    return {'status': 'healthy', 'app_name': 'Bot Simulator Worker', 'version': '1.0.0'}

@app.post('/simulator/portfolio/create')
async def create_portfolio(payload: dict):
    user = payload['mobile']
    room = payload.get('room', 'xag')
    key = f'{user}:{room}'
    state['portfolios'][key] = {'mobile': user, 'room': room, 'balance': payload.get('initial_balance', 1000000)}
    return {'success': True, 'portfolio': state['portfolios'][key]}

@app.post('/simulator/order/create')
async def create_order(payload: dict):
    oid = str(len(state['orders']) + 1)
    state['orders'][oid] = payload | {'id': oid, 'status': 'open'}
    return {'success': True, 'order': state['orders'][oid]}

@app.post('/simulator/order/close')
async def close_order(payload: dict):
    oid = str(payload['id'])
    if oid in state['orders']:
        state['orders'][oid]['status'] = 'closed'
    return {'success': oid in state['orders']}

@app.get('/simulator/orders')
async def get_orders():
    return {'success': True, 'orders': list(state['orders'].values())}
