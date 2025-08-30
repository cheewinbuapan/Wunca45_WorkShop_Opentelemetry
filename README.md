# Full Stack Application with OpenTelemetry Monitoring

นี่คือ Full Stack Application ที่ประกอบด้วย .NET Backend API, Frontend UI และ OpenTelemetry monitoring stack:

## Components (ส่วนประกอบ)

### Application Services
- **Frontend UI** - Web user interface (Nuxt.js)
- **.NET API** - Backend API service (ASP.NET Core)

### Database Services  
- **PostgreSQL** - Single database instance สำหรับ application และ Grafana

### Monitoring & Observability Services
- **Grafana** (2 nodes + Nginx Load Balancer) - Visualization และ Dashboard
- **Prometheus** - Metrics collection
- **Loki** - Log aggregation
- **Tempo** - Distributed tracing
- **OpenTelemetry Collector** - Telemetry data collection
- **Blackbox Exporter** - Endpoint monitoring และ health checks
- **Alertmanager** - Alert management

## Ports (พอร์ต)

| Service | Port | Description |
|---------|------|-------------|
| **Frontend UI** | **3006** | **Main web application** |
| **Backend API** | **8080** | **Main API endpoint** |
| Grafana (via Nginx) | 3005 | Main access point |
| Grafana Node 1 | 3000 | Direct access |
| Grafana Node 2 | 3001 | Direct access |
| Prometheus | 9090 | Metrics |
| Loki | 3100 | Logs |
| Tempo | 3200 | Tracing |
| PostgreSQL | 5432 | Database |
| Blackbox Exporter | 9115 | Endpoint monitoring |
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
│   ├── ...
├── front/                      # Frontend Nuxt.js source code
│   ├── ...
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
    ├── blackbox/blackbox.yml
    ├── alertmanager/alertmanager.yml
    ├── nginx/nginx.conf
    └── postgres/init.sql
```

## วิธีการ Run

### 1. เริ่มต้นระบบทั้งหมด

```bash
# เริ่มต้น services ทั้งหมด (Backend API + Frontend + Monitoring Stack)
docker compose up -d --build

# ดู logs ของทุก services
docker compose logs -f

# ดู logs เฉพาะ API
docker compose logs -f api

# ดู logs เฉพาะ Frontend
docker compose logs -f frontend

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
1. **Frontend UI**: http://localhost:3006
2. **Backend API**: http://localhost:8080
   - Swagger UI: http://localhost:8080/swagger
   - Health Check: http://localhost:8080/health

### Monitoring & Observability
1. **Grafana**: http://localhost:3005
   - Username: `admin`
   - Password: `admin`

2. **Prometheus**: http://localhost:9090

3. **Alertmanager**: http://localhost:9093

4. **Tempo (Tracing)**: http://localhost:3200

5. **Loki (Logs)**: http://localhost:3100

6. **Blackbox Exporter**: http://localhost:9115

## Database Connection

API เชื่อมต่อกับ PostgreSQL database:
- **Connection String**: `Server=postgres;Port=5432;Database=postgres;User Id=postgres;Password=adminpassword;`
- **Database Access**: `localhost:5432`

## Troubleshooting

### ปัญหาที่อาจพบ

1. **Port conflict**: ถ้า port ติดขัด ให้แก้ไข ports ใน docker-compose.yml

2. **API ไม่สามารถเชื่อมต่อ Database**: 
   - ตรวจสอบว่า PostgreSQL container เริ่มเสร็จแล้ว
   - ดู logs: `docker compose logs postgres`

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
docker compose logs frontend
docker compose logs grafana-node-1
docker compose logs prometheus
docker compose logs blackbox
docker compose logs postgres

# ดู logs แบบ real-time
docker compose logs -f [service-name]
```

### การ Debug

```bash
# เข้าไปใน container
docker compose exec api bash
docker compose exec frontend sh
docker compose exec grafana-node-1 sh
docker compose exec prometheus sh
docker compose exec blackbox sh

# ตรวจสอบ network connectivity
docker compose exec api ping postgres
docker compose exec frontend ping api
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

### Blackbox Exporter สำหรับ Endpoint Monitoring

Blackbox Exporter ใช้สำหรับ:
- **HTTP/HTTPS endpoint monitoring**: ตรวจสอบว่า websites และ APIs ทำงานปกติ
- **Health checks**: ping และ TCP connectivity tests
- **Response time monitoring**: วัดเวลาตอบสนองของ endpoints
- **SSL certificate monitoring**: ตรวจสอบอายุของ SSL certificates

Configuration อยู่ใน `Opentelemetry/blackbox/blackbox.yml`

## Configuration Notes

- **PostgreSQL**: ใช้ single database instance 
- **Grafana**: มี 2 nodes พร้อม Nginx load balancer
- **Prometheus**: configured retention 7 วัน
- **Blackbox Exporter**: ใช้สำหรับ HTTP/HTTPS endpoint monitoring และ health checks
- **API**: .NET 8.0 ASP.NET Core application
- **Frontend**: Nuxt.js application
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
frontend -> api
api -> postgres, otel-collector
grafana-* -> postgres
tempo -> otel-collector
prometheus -> alertmanager
nginx -> grafana-node-1, grafana-node-2
```
