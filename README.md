# polycubehacks
personal polycube hacking, please see polycu.be for original

This is a modified, static version of the page that does not have any server storage.
It includes some new functionality I wanted:

* typed javascript arrays so big arrays go vroom.
* 1:1 and scaled blit functions so we can display a software rendered image on the screen. putpixel must go vroooom!
* some more error messages, such as not allowing int foo = 3.14 without a cast.
* operators << and >> for ints.
* warning on implicit conversion to-from int/double.

TODO
* Functions returning a value indexed by a global/static array require storing the value in a temp before return.
  ex, static vec3 color[MAX_C] = {...}; vec3 getColor(i) { vec3 tmp=color[i]; return t; }
