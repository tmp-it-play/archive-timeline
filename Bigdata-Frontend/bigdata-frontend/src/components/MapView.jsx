import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 기본 좌표: 광주 광산구청
const DEFAULT_CENTER = [35.139964, 126.793027];

// 간단한 주소 → 좌표 변환 (실제 서비스에서는 geocoding API 필요)
const addressToLatLng = (address) => {
  // 임시: 랜덤 좌표 생성 (동일 주소는 동일 위치)
  const hash = address.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const lat = DEFAULT_CENTER[0] + ((hash % 100) - 50) * 0.0005;
  const lng = DEFAULT_CENTER[1] + ((hash % 100) - 50) * 0.0007;
  return [lat, lng];
};

const MapView = ({ restaurants = [] }) => {
  useEffect(() => {
    const map = L.map('map').setView(DEFAULT_CENTER, 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // 마커 추가
    restaurants.forEach(r => {
      const [lat, lng] = addressToLatLng(r.address || r.location || r.roadAddr || r.jibunAddr || '');
      L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`<b>${r.name || r.bizName}</b><br/>${r.address || r.roadAddr || ''}`);
    });

    return () => map.remove();
  }, [restaurants]);

  return (
    <div id="map" style={{ width: '100%', height: '400px', borderRadius: '12px', margin: '16px 0' }}></div>
  );
};

export default MapView;
