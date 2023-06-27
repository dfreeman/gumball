all: out/hello-world.gb

watch:
	watchexec -w src -w include -- 'echo Building...; make all; echo Done.'

out:
	mkdir -p out

out/%.o: src/%.asm out include/*
	rgbasm -o $@ $<

out/hello-world.gb: out/main.o
	rgblink -o out/hello-world.gb out/main.o -m out/hello-world.map -n out/hello-world.sym
	rgbfix -v -p 0 out/hello-world.gb --title "hello world"

clean:
	rm -rf out
