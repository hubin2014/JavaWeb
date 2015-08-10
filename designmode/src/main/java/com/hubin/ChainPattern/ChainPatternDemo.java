package com.hubin.ChainPattern;

public class ChainPatternDemo {
	
	AbstractLogger errorLogger=new ErrorLogger(AbstractLogger.ERROR);
	AbstractLogger fileLogger=new FileLogger(AbstractLogger.DEBUG);
	AbstractLogger consoleLogger=new ConsoleLogger(AbstractLogger.INFO);
	public static void main(String[] args) {
		ChainPatternDemo chainPatternDemo=new ChainPatternDemo();
		chainPatternDemo.start();
	}
	
	public void start(){
		errorLogger.setNextLogger(fileLogger);
		fileLogger.setNextLogger(consoleLogger);
		consoleLogger.setNextLogger(null);
		errorLogger.logMessage(AbstractLogger.ERROR, 
		         "This is an information.");
	}
}
