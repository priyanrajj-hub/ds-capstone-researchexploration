"use client";
import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';

export default function Embeddings3D({ points, queryPoint, useANN, result }: any) {
    const { positions, colors } = useMemo(() => {
        const _positions = new Float32Array(points.length * 3);
        const _colors = new Float32Array(points.length * 3);
        const colorObj = new THREE.Color();

        points.forEach((p: any, i: number) => {
            // Remap 800x600 space to a normal 3D coordinate system
            const x = (p.x - 400) / 10;
            const y = -(p.y - 300) / 10;
            // Generate a deterministic but 3D scattered layout based on point ID hash
            const z = ((p.x * p.y) % 50) - 25;

            _positions[i * 3] = x;
            _positions[i * 3 + 1] = y;
            _positions[i * 3 + 2] = z;

            const isSearchSpace = result.searchSpace.includes(p);
            const isNeighbor = result.neighbors.includes(p);

            let hex = "#5B6B75"; // unsearched
            if (!useANN || isSearchSpace) hex = "#1C7293";
            if (isNeighbor) hex = "#10B981";

            colorObj.set(hex);
            _colors[i * 3] = colorObj.r;
            _colors[i * 3 + 1] = colorObj.g;
            _colors[i * 3 + 2] = colorObj.b;
        });

        return { positions: _positions, colors: _colors };
    }, [points, useANN, result]);

    const qx = (queryPoint.x - 400) / 10;
    const qy = -(queryPoint.y - 300) / 10;
    const qz = 0;

    return (
        <Canvas camera={{ position: [0, 0, 80] }}>
            <ambientLight intensity={0.8} />
            <pointLight position={[10, 10, 10]} intensity={2} />
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} autoRotate={true} autoRotateSpeed={1.5} />

            <points>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" array={positions} count={points.length} itemSize={3} />
                    <bufferAttribute attach="attributes-color" array={colors} count={points.length} itemSize={3} />
                </bufferGeometry>
                <pointsMaterial size={1.5} vertexColors={true} />
            </points>

            <Sphere position={[qx, qy, qz]} args={[1, 16, 16]}>
                <meshStandardMaterial color="#fff" emissive="#10B981" emissiveIntensity={0.8} />
            </Sphere>

            {useANN && (
                <Sphere position={[qx, qy, qz]} args={[20, 32, 32]}>
                    <meshStandardMaterial color="#1C7293" transparent opacity={0.15} depthWrite={false} side={THREE.DoubleSide} />
                </Sphere>
            )}
        </Canvas>
    );
}
