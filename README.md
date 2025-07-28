# Full Stack Application with OpenTelemetry Monitoring

นี่คือ Full Stack Application ที่ประกอบด้วย .NET Backend API และ OpenTelemetry monitoring stack:

## Components (ส่วนประกอบ)

### Backend Services
- **.NET API** - Backend API service (ASP.NET Core)

### Database Services  
- **PostgreSQL** (2 nodes + HAProxy) - Database cluster สำหรับ application และ Grafana

### Monitoring & Observability Services
- **Grafana** (2 nodes + Nginx Load Balancer) - Visualization และ Dashboard
- **Prometheus** - Metrics collection
- **Loki** - Log aggregation
- **Tempo** - Distributed tracing
- **OpenTelemetry Collector** - Telemetry data collection
- **Alertmanager** - Alert management

## Ports (พอร์ต)

| Service | Port | Description |
|---------|------|-------------|
| **Backend API** | **8080** | **Main API endpoint** |
| Grafana (via Nginx) | 3005 | Main access point |
| Grafana Node 1 | 3000 | Direct access |
| Grafana Node 2 | 3001 | Direct access |
| Prometheus | 9090 | Metrics |
| Loki | 3100 | Logs |
| Tempo | 3200 | Tracing |
| PostgreSQL Node 1 | 5432 | Database |
| PostgreSQL Node 2 | 5433 | Database |
| PostgreSQL HAProxy | 5434 | Load balanced DB |
| Alertmanager | 9093 | Alerts |
| OpenTelemetry | 4317, 8888, 8889 | Telemetry |

## Prerequisites (ข้อกำหนดเบื้องต้น)

1. Docker และ Docker Compose ติดตั้งแล้ว
2. .NET 8.0 SDK (สำหรับ development)
3. ไฟล์ configuration ทั้งหมดต้องอยู่ในตำแหน่งที่ถูกต้อง

## Project Structure (โครงสร้างโปรเจค)

```
├── docker-compose.yml          # Main compose file (รวมทุกอย่าง)
├── BackEnd/                   # .NET API source code
│   ├── Program.cs
│   ├── appsettings.json
│   ├── Controllers/
│   ├── Models/
│   ├── Services/
│   └── ...
└── Opentelemetry/            # Monitoring configurations
    ├── grafana/
    │   ├── config/grafana.ini
    │   ├── provisioning/
    │   └── dashboards/
    ├── prometheus/
    │   ├── prometheus.yml
    │   └── alert.rules.yml
    ├── loki/loki.yml
    ├── tempo/tempo.yml
    ├── otel/otel.yml
    ├── alertmanager/alertmanager.yml
    ├── nginx/nginx.conf
    ├── haproxy/postgres.cfg
    └── postgres/init.sql
```

## วิธีการ Run

### 1. เริ่มต้นระบบทั้งหมด

```bash
# เริ่มต้น services ทั้งหมด (Backend API + Monitoring Stack)
docker compose up -d

# ดู logs ของทุก services
docker compose logs -f

# ดู logs เฉพาะ API
docker compose logs -f api

# ดู status ของทุก containers
docker compose ps
```

### 2. หยุด Services

```bash
# หยุด services ทั้งหมด
docker compose down

# หยุดและลบ volumes (ข้อมูลจะหายหมด!)
docker compose down -v
```

## การเข้าใช้งาน

### Main Application
1. **Backend API**: http://localhost:8080
   - Swagger UI: http://localhost:8080/swagger
   - Health Check: http://localhost:8080/health

### Monitoring & Observability

### Monitoring & Observability
1. **Grafana**: http://localhost:3005
   - Username: `admin`
   - Password: `admin`

2. **Prometheus**: http://localhost:9090

3. **Alertmanager**: http://localhost:9093

4. **Tempo (Tracing)**: http://localhost:3200

5. **Loki (Logs)**: http://localhost:3100

## Database Connection

API เชื่อมต่อกับ PostgreSQL cluster ผ่าน HAProxy:
- **Connection String**: `Server=postgres-haproxy;Port=5432;Database=repmgr;User Id=repmgr;Password=repmgrpass;`
- **Direct PostgreSQL Access**: 
  - Node 1: `localhost:5432`
  - Node 2: `localhost:5433`  
  - HAProxy Load Balancer: `localhost:5434`

## Troubleshooting

### ปัญหาที่อาจพบ

1. **Port conflict**: ถ้า port ติดขัด ให้แก้ไข ports ใน docker-compose.yml

2. **API ไม่สามารถเชื่อมต่อ Database**: 
   - ตรวจสอบว่า PostgreSQL containers เริ่มเสร็จแล้ว
   - ดู logs: `docker compose logs postgres-node-1 postgres-node-2`

3. **Configuration files missing**: ตรวจสอบว่าไฟล์ config ใน `Opentelemetry/` folder ทั้งหมดมีอยู่

4. **Permission issues**: ใน Linux/Mac อาจต้อง:
   ```bash
   sudo chown -R $USER:$USER .
   ```

5. **Memory issues**: Services เหล่านี้ใช้ RAM มาก ตรวจสอบ Docker memory limits

### การดู Logs

```bash
# ดู logs ของ service เฉพาะ
docker compose logs api
docker compose logs grafana-node-1
docker compose logs prometheus
docker compose logs postgres-node-1

# ดู logs แบบ real-time
docker compose logs -f [service-name]
```

### การ Debug

```bash
# เข้าไปใน container
docker compose exec api bash
docker compose exec grafana-node-1 sh
docker compose exec prometheus sh

# ตรวจสอบ network connectivity
docker compose exec api ping postgres-haproxy
docker compose exec grafana-node-1 ping prometheus
```

## Development

### การ Build API แยก

```bash
# Build และ run เฉพาะ API
docker compose up api -d

# หรือ build จาก source
cd BackEnd
dotnet build
dotnet run
```

### การเพิ่ม OpenTelemetry ใน API

API ได้รับการกำหนดค่าให้ส่งข้อมูล telemetry ไปยัง OpenTelemetry Collector:
- **Metrics**: ส่งไปยัง Prometheus
- **Traces**: ส่งไปยัง Tempo  
- **Logs**: ส่งไปยัง Loki

## Configuration Notes

- **PostgreSQL**: ใช้ replication setup ด้วย repmgr (2 nodes + HAProxy load balancer)
- **Grafana**: มี 2 nodes พร้อม Nginx load balancer
- **Prometheus**: configured retention 7 วัน
- **API**: .NET 8.0 ASP.NET Core application
- **OpenTelemetry**: รวบรวมข้อมูล metrics, traces, และ logs
- **ข้อมูลจัดเก็บ**: ใน Docker volumes

## Security Notes

⚠️ **สำคัญ**: นี่เป็น development setup
- Password เป็น default values
- ไม่มี SSL/TLS
- Database credentials เป็น default
- ก่อนใช้ production ควร:
  - เปลี่ยน passwords ทั้งหมด (Database, Grafana, etc.)
  - เพิ่ม SSL certificates
  - ตั้งค่า proper security configurations
  - ใช้ environment variables สำหรับ sensitive data
  - กำหนด network security policies

## Container Dependencies

```
api -> postgres-haproxy, otel-collector
postgres-haproxy -> postgres-node-1, postgres-node-2
grafana-* -> postgres-haproxy
tempo -> otel-collector
prometheus -> alertmanager
nginx -> grafana-node-1, grafana-node-2
```
