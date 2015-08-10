package com.hubin.ChainPattern;

public class ErrorLogger extends AbstractLogger {

	public ErrorLogger(int level){
		this.level=level;
	}
	@Override
	protected void write(String message) {
		System.out.println("错误日志模式"+message);
	}

}
