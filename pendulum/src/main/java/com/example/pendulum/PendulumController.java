package com.example.pendulum;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class PendulumController {

@org.springframework.beans.factory.annotation.Autowired
    private Simulation simulation;

// Setter-инъекция

public static class PendulumRequest {
    private double length;
    private double angle;

    public double getLength() {
        return length;
    }

    public void setLength(double length) {
        this.length = length;
    }

    public double getAngle() {
        return angle;
    }

    public void setAngle(double angle) {
        this.angle = angle;
    }
}

public static class PendulumResponse {
    private double period;
    private double gravity;

    public PendulumResponse(double period, double gravity) {
        this.period = period;
        this.gravity = gravity;
    }

    public double getPeriod() {
        return period;
    }

    public double getGravity() {
        return gravity;
    }
}

@GetMapping("/pendulum")
public String showPendulumPage() {
    return "pendulum";
}

@PostMapping("/pendulum")
@ResponseBody
public PendulumResponse calculatePendulum(@RequestBody PendulumRequest request) {
    double length = request.getLength();
    double angle = request.getAngle();
    double initialG = 9.8;

    simulation.initialize(length, angle, initialG);
    double period = simulation.getCurrentPeriod();
    double gravity = simulation.refineGravity(period);

    log.info("POST request processed. Period = {}", period);
    return new PendulumResponse(period, gravity);
}
}

