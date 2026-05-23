# 📈 Grafana Monitoring Setup

This folder contains the Docker setup and configuration for **Grafana** used in the DevOpsConnect infrastructure.

Grafana is used for:
- Infrastructure Monitoring
- Backend Monitoring
- Metrics Visualization
- Real-Time Dashboards

---

# 🚀 Run Grafana Container

```bash
docker run -d \
  --name grafana \
  -p 3000:3000 \
  -v grafana-storage:/var/lib/grafana \
  --restart always \
  grafana/grafana
