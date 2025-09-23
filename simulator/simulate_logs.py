import json, time, random
from kafka import KafkaProducer

producer = KafkaProducer(
    bootstrap_servers='localhost:9092',
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

hosts = ['web-1', 'api-2', 'db-1', 'cache-1']
sev = ['INFO', 'WARN', 'ERROR', 'CRITICAL']

def make_event():
    return {
        "timestamp": time.time(),
        "host": random.choice(hosts),
        "service": random.choice(['nginx','app','postgres','redis']),
        "message": "Simulated log message",
        "level": random.choices(sev, weights=[60,25,10,5])[0],
        "metrics": {"cpu": random.randint(1,95), "mem": random.randint(1,95)}
    }

if __name__ == "__main__":
    while True:
        ev = make_event()
        producer.send('it-logs', ev)
        print("sent", ev)
        time.sleep(random.random()*2)
