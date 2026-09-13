package manual;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class Main {

    public static void processMarks(String inp) {
        String[] tokens = inp.split(",");
        List<Double> validMarks = new ArrayList<>();
        int passingCount = 0;

        for (String token : tokens) {
            String trimmed = token.trim();
            if (trimmed.isEmpty()) {
                continue;
            }

            try {
                double mark = Double.parseDouble(trimmed);
                if (mark >= 0 && mark <= 100) {
                    validMarks.add(mark);
                    if (mark >= 50) {
                        passingCount++;
                    }
                }
            } catch (NumberFormatException e) {
            }
        }

        if (validMarks.isEmpty()) {
            System.out.println("No valid marks found");
            return;
        }

        double sum = 0;
        double highest = validMarks.get(0);
        double lowest = validMarks.get(0);

        for (double mark : validMarks) {
            sum += mark;
            if (mark > highest) highest = mark;
            if (mark < lowest) lowest = mark;
        }

        double average = sum / validMarks.size();
        double passRate = ((double) passingCount / validMarks.size()) * 100.0;

        double roundedPassRate = Math.round(passRate * 10.0) / 10.0;

        System.out.println("\nValid: " + validMarks.size());
        System.out.printf(Locale.US, "Average: %.2f\n", average);
        System.out.println("Highest: " + formatNumber(highest));
        System.out.println("Lowest: " + formatNumber(lowest));
        System.out.println("Pass rate: " + roundedPassRate + "%");
    }

    private static String formatNumber(double value) {
        if (value == (long) value) {
            return String.format("%d", (long) value);
        }
        return String.valueOf(value);
    }

    public static void main(String[] args) {
        String testA = "85, 23, 45, 90, 92";
        String testB = "88, 47, -5, 101, abc, 73, 50, , 100";
        String testC = "10, 20, 30";
        String testD = "abc, , xyz";

        System.out.print("Test A: ");
        processMarks(testA);

        System.out.print("Test B: ");
        processMarks(testB);

        System.out.print("Test C: ");
        processMarks(testC);

        System.out.print("Test D: ");
        processMarks(testD);
    }
}