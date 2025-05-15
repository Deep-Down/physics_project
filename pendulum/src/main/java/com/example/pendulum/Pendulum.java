package com.example.pendulum;

public class Pendulum {
    private double length;
    private double angle;

    public Pendulum(double length, double angle) {
        this.length = length;
        this.angle = angle;
    }

    public double calculatePeriod(double gravity) {
        return 2 * Math.PI * Math.sqrt(length / gravity);
    }

    public double calculateGravity(double period) {
        if (period <= 0) {
            throw new IllegalArgumentException("Period must be positive");
        }
        return (4 * Math.PI * Math.PI * length) / (period * period);
    }

    public double getLength() {
        return length;
    }

    public void setLength(double length) {
        if (length <= 0) {
            throw new IllegalArgumentException("Length must be positive");
        }
        this.length = length;
    }

    public double getAngle() {
        return angle;
    }

    public void setAngle(double angle) {
        this.angle = angle;
    }
}
