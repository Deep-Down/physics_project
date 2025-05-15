package com.example.pendulum;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class Simulation {
    private double length;
    private double angle;
    private double gravity;

    public Simulation(double length, double angle, double gravity) {
        if (length <= 0 || angle < 0 || angle > 90) {
            throw new IllegalArgumentException("Invalid parameters.");
        }
        this.length = length;
        this.angle = angle;
        this.gravity = gravity;
    }

    public double getCurrentPeriod() {
        double thetaRad = Math.toRadians(angle);
        double correction = 1 + Math.pow(thetaRad, 2) / 16.0;
        double period = 2 * Math.PI * Math.sqrt(length / gravity) * correction;
        log.info("Calculated period: {}", period);
        return period;
    }
    

    public double refineGravity(double measuredPeriod) {
        return 4 * Math.PI * Math.PI * length / (measuredPeriod * measuredPeriod);
    }
}


