import reactSvg from 'simple-icons/icons/react.svg?raw'
import vuedotjsSvg from 'simple-icons/icons/vuedotjs.svg?raw'
import javascriptSvg from 'simple-icons/icons/javascript.svg?raw'
import html5Svg from 'simple-icons/icons/html5.svg?raw'
import cssSvg from 'simple-icons/icons/css.svg?raw'
import openjdkSvg from 'simple-icons/icons/openjdk.svg?raw'
import goSvg from 'simple-icons/icons/go.svg?raw'
import dockerSvg from 'simple-icons/icons/docker.svg?raw'
import nginxSvg from 'simple-icons/icons/nginx.svg?raw'
import ginSvg from 'simple-icons/icons/gin.svg?raw'
import viteSvg from 'simple-icons/icons/vite.svg?raw'
import linuxSvg from 'simple-icons/icons/linux.svg?raw'
import neo4jSvg from 'simple-icons/icons/neo4j.svg?raw'
import redisSvg from 'simple-icons/icons/redis.svg?raw'
import rabbitmqSvg from 'simple-icons/icons/rabbitmq.svg?raw'
import pythonSvg from 'simple-icons/icons/python.svg?raw'
import mysqlSvg from 'simple-icons/icons/mysql.svg?raw'
import springSvg from 'simple-icons/icons/spring.svg?raw'
import springbootSvg from 'simple-icons/icons/springboot.svg?raw'
import typescriptSvg from 'simple-icons/icons/typescript.svg?raw'
import cplusplusSvg from 'simple-icons/icons/cplusplus.svg?raw'
import rustSvg from 'simple-icons/icons/rust.svg?raw'
import phpSvg from 'simple-icons/icons/php.svg?raw'
import kotlinSvg from 'simple-icons/icons/kotlin.svg?raw'
import shellSvg from 'simple-icons/icons/shell.svg?raw'
import yamlSvg from 'simple-icons/icons/yaml.svg?raw'
import sassSvg from 'simple-icons/icons/sass.svg?raw'

type SimpleIcon = {
  svg: string
  hex: string
}

const createIcon = (svg: string, hex: string): SimpleIcon => ({
  svg,
  hex
})

export const siReact = createIcon(reactSvg, '61DAFB')
export const siVuedotjs = createIcon(vuedotjsSvg, '4FC08D')
export const siJavascript = createIcon(javascriptSvg, 'F7DF1E')
export const siHtml5 = createIcon(html5Svg, 'E34F26')
export const siCss = createIcon(cssSvg, '663399')
export const siOpenjdk = createIcon(openjdkSvg, '000000')
export const siGo = createIcon(goSvg, '00ADD8')
export const siDocker = createIcon(dockerSvg, '2496ED')
export const siNginx = createIcon(nginxSvg, '009639')
export const siGin = createIcon(ginSvg, '008ECF')
export const siVite = createIcon(viteSvg, '646CFF')
export const siLinux = createIcon(linuxSvg, 'FCC624')
export const siNeo4j = createIcon(neo4jSvg, '4581C3')
export const siRedis = createIcon(redisSvg, 'FF4438')
export const siRabbitmq = createIcon(rabbitmqSvg, 'FF6600')
export const siPython = createIcon(pythonSvg, '3776AB')
export const siMysql = createIcon(mysqlSvg, '4479A1')
export const siSpring = createIcon(springSvg, '6DB33F')
export const siSpringboot = createIcon(springbootSvg, '6DB33F')
export const siTypescript = createIcon(typescriptSvg, '3178C6')
export const siCplusplus = createIcon(cplusplusSvg, '00599C')
export const siRust = createIcon(rustSvg, '000000')
export const siPhp = createIcon(phpSvg, '777BB4')
export const siKotlin = createIcon(kotlinSvg, '7F52FF')
export const siShell = createIcon(shellSvg, 'FFD500')
export const siYaml = createIcon(yamlSvg, 'CB171E')
export const siSass = createIcon(sassSvg, 'CC6699')

export type { SimpleIcon }
