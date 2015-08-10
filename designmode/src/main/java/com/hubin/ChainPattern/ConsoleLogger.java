package com.hubin.ChainPattern;

public class ConsoleLogger extends AbstractLogger {
	
	public ConsoleLogger(int level){
		this.level=level;
	}

	@Override
	protected void write(String message) {
		System.out.println("控制台日志模式"+message);
	}

}
