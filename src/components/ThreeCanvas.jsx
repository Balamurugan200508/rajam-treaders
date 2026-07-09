import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeCanvas() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Dimensions
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a100c, 0.015);

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 25;
    camera.position.y = 2;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x112211, 1);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffe699, 3, 100);
    sunLight.position.set(15, 12, 10);
    scene.add(sunLight);

    const greenLight = new THREE.DirectionalLight(0x34d399, 1.5);
    greenLight.position.set(-10, -5, 5);
    scene.add(greenLight);

    // Sun (Glowing Sphere)
    const sunGeo = new THREE.SphereGeometry(3, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({
      color: 0xffdd67,
      transparent: true,
      opacity: 0.8,
    });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    sun.position.set(12, 8, -5);
    scene.add(sun);

    // Sun Glow Rings
    const rings = [];
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.RingGeometry(3.2 + i * 0.8, 3.3 + i * 0.8, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.3 - i * 0.08,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(sun.position);
      scene.add(ring);
      rings.push(ring);
    }

    // Solar Panel Mesh (Silicon blue/black grid)
    const panelGroup = new THREE.Group();
    const panelWidth = 14;
    const panelHeight = 8;
    
    // Panel base frame
    const frameGeo = new THREE.BoxGeometry(panelWidth + 0.4, panelHeight + 0.4, 0.3);
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.5,
      metalness: 0.8
    });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    panelGroup.add(frame);

    // Solar cells (grid of blue glassy rectangles)
    const cellRows = 4;
    const cellCols = 6;
    const cellW = panelWidth / cellCols - 0.15;
    const cellH = panelHeight / cellRows - 0.15;
    const cellGeo = new THREE.BoxGeometry(cellW, cellH, 0.1);
    const cellMat = new THREE.MeshStandardMaterial({
      color: 0x0f2b48,
      roughness: 0.1,
      metalness: 0.9,
      emissive: 0x10b981,
      emissiveIntensity: 0.05
    });

    for (let r = 0; r < cellRows; r++) {
      for (let c = 0; c < cellCols; c++) {
        const cell = new THREE.Mesh(cellGeo, cellMat);
        const posX = -panelWidth / 2 + cellW / 2 + c * (cellW + 0.15) + 0.075;
        const posY = -panelHeight / 2 + cellH / 2 + r * (cellH + 0.15) + 0.075;
        cell.position.set(posX, posY, 0.15);
        panelGroup.add(cell);
      }
    }

    // Metal Stand
    const standGeo = new THREE.CylinderGeometry(0.3, 0.3, 8, 16);
    const standMat = new THREE.MeshStandardMaterial({ color: 0x3f3f46, metalness: 0.9, roughness: 0.2 });
    const stand = new THREE.Mesh(standGeo, standMat);
    stand.position.set(0, -5, -1);
    panelGroup.add(stand);

    panelGroup.position.set(-6, -2, 0);
    panelGroup.rotation.x = -0.3;
    panelGroup.rotation.y = 0.5;
    scene.add(panelGroup);

    // Rising energy particles (Green solar energy)
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    const initialY = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Position particles around panel and sun area
      const x = (Math.random() - 0.5) * 35;
      const y = -10 + Math.random() * 25;
      const z = (Math.random() - 0.5) * 20;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      speeds[i] = 0.05 + Math.random() * 0.08;
      initialY[i] = y;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    // Create soft green energy dot texture
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(52, 211, 153, 1)');
    grad.addColorStop(1, 'rgba(52, 211, 153, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);
    
    const pTexture = new THREE.CanvasTexture(canvas);
    const pMaterial = new THREE.PointsMaterial({
      size: 0.5,
      map: pTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.7
    });

    const particles = new THREE.Points(particleGeo, pMaterial);
    scene.add(particles);

    // Mouse movement track
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (event) => {
      mouseX = (event.clientX - width / 2) / 100;
      mouseY = (event.clientY - height / 2) / 100;
    };

    window.addEventListener('mousemove', onMouseMove);

    // Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Slow idle rotation of panel
      panelGroup.rotation.y = 0.5 + Math.sin(elapsed * 0.5) * 0.15;
      panelGroup.rotation.x = -0.3 + Math.cos(elapsed * 0.4) * 0.08;

      // Sun pulse
      sun.scale.setScalar(1 + Math.sin(elapsed * 2) * 0.03);
      rings.forEach((ring, idx) => {
        ring.rotation.z += 0.005 * (idx + 1);
        ring.scale.setScalar(1 + Math.sin(elapsed * 1.5 + idx) * 0.05);
      });

      // Camera mouse lag/follow
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;
      camera.position.x = targetX * 1.5;
      camera.position.y = 2 + targetY * -1.5;
      camera.lookAt(new THREE.Vector3(0, 0, 0));

      // Update energy particles
      const posArr = particles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        // Move particle up
        posArr[i * 3 + 1] += speeds[i];
        // Rotate them gently around the center
        posArr[i * 3] += Math.sin(elapsed + i) * 0.01;

        // Reset if it goes too high
        if (posArr[i * 3 + 1] > 18) {
          posArr[i * 3 + 1] = -12;
          posArr[i * 3] = (Math.random() - 0.5) * 35;
          posArr[i * 3 + 2] = (Math.random() - 0.5) * 20;
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full -z-10 pointer-events-none overflow-hidden" />;
}
