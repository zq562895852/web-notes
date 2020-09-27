/**
 * xss安全：
 *   1.1反射型xss,请求路径中函数恶意代码被执行
 *   1.2DOM型 ，input输入等，输入一段恶意脚本，浏览器执行了
 *   1.3  恶意脚本永久存储在目标服务器上。当浏览器请求数据时，脚本从服务器传回并执行，影响范围比反射型和DOM型XSS更大。存储型XSS攻击的原因仍然是没有做好数据过滤：前端提交数据至服务端时，没有做好过滤；服务端在接受到数据时，在存储之前，没有做过滤；前端从服务端请求到数据，没有过滤输出
  攻击者将恶意代码提交到目标网站的数据库中。
用户打开目标网站时，网站服务端将恶意代码从数据库取出，拼接在 HTML 中返回给浏览器。
用户浏览器接收到响应后解析执行，混在其中的恶意代码也被执行。
恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作。
1.4 基于字符集的 XSS
「基于字符集的 XSS 攻击」的原因是由于浏览器在 meta 没有指定 charset 的时候有自动识别编码的机制，所以这类攻击通常就是发生在没有指定或者没来得及指定 meta 标签的 charset 的情况下。
记住指定 <meta charset="utf-8">
XML 中不仅要指定字符集为 utf-8，而且标签要闭合



除了谨慎的转义外，还需要其他的手段来防范xss攻击
1 在服务端使用 HTTP的 Content-Security-Policy 头部来指定策略，或者在前端设置 meta 标签
<meta http-equiv="Content-Security-Policy" content="form-action 'self';">
严格的 CSP 在 XSS 的防范中可以起到以下的作用：

禁止加载外域代码，防止复杂的攻击逻辑。
禁止外域提交，网站被攻击后，用户的数据不会泄露到外域。
禁止内联脚本执行（规则较严格，目前发现 GitHub 使用）。
禁止未授权的脚本执行（新特性，Google Map 移动版在使用）。
合理使用上报可以及时发现 XSS，利于尽快修复问题。
2 限制输入的长度
   对于不受信任的输入，都应该限定一个合理的长度。虽然无法完全防止 XSS 发生，但可以增加 XSS 攻击的难度。
3 输入内容限制
   对于部分输入，可以限定不能包含特殊字符或者仅能输入数字等。
4 HTTP-only Cookie: 禁止 JavaScript 读取某些敏感 Cookie，攻击者完成 XSS 注入后也无法窃取此 Cookie。
验证码：防止脚本冒充用户提交危险操作

那如何检测自己的网站是否有xss漏洞
  1 使用通用的xss攻击字串手动检测xss漏洞



  
  2 使用第三方工具
 */
const test_xss = `jaVasCript:/*-/*`(/*\`/*'/*"/**/ /* */ (oNcliCk = alert())); //%0D%0A%0d%0a//</stYle/</titLe/</teXtarEa/</scRipt/--!>\x3csVg/<sVg/oNloAd=alert()//>\x3e`
/**
 * 能够检测到存在于 HTML 属性、HTML 文字内容、HTML 注释、跳转链接、内联 JavaScript 字符串、内联 CSS 样式表等多种上下文中的 XSS 漏洞，也能检测 eval()、setTimeout()、setInterval()、Function()、innerHTML、document.write() 等 DOM 型 XSS 漏洞，并且能绕过一些 XSS 过滤器
 */

/**
 * CSRF:跨站请求伪造，攻击者诱导受害者进入第三方网站，在第三方网站中，
 * 
 * 
 * 受害者登录A站点，并保留了登录凭证（Cookie）。
    攻击者诱导受害者访问了站点B。
    站点B向站点A发送了一个请求，浏览器会默认携带站点A的Cookie信息。
    站点A接收到请求后，对请求进行验证，并确认是受害者的凭证，误以为是无辜的受害者发送的请求。
    站点A以受害者的名义执行了站点B的请求。
    攻击完成，攻击者在受害者不知情的情况下，冒充受害者完成了攻击。
 */

/**
 * SQL注入:利用表单提交数据进行数据查询，例如 输入用户名和密码后端的sql是这么写的
 *  let querySQL = `SELECT *FROM user WHERE username='${username}' AND psw='${password}'`;
 *  恶意攻击者输入的是：zoumaijiang OR 1=1 --'psw=xxxx' 这样就把密码注释掉 1=1永真的情况下可以登入任何账户
 *
 *  所以后端要对输入的内容选择完全不信任，所有的输入都要进行转义过滤
 *
 */

/**
 * 命令行注入：
 *   假如现在需要实现一个需求：用户提交一些内容到服务器，然后在服务器执行一些系统命令去产出一个结果返回给用户
 *   当用户输入要执行的代码是：https://github.com/xx/xx.git && rm -rf /* 而权限又恰好root,所有的文件就会被删除
 *
 *   后端对前端提交内容需要完全选择不相信，并且对其进行规则限制（比如正则表达式）。
 *   在调用系统命令前对所有传入参数进行命令行参数转义过滤
 *   不要直接拼接命令语句，借助一些工具做拼接、转义预处理
 */

/**
 * DDoS攻击：
 *  网络层攻击：比如发送半链接，让服务器以为没有发送完而等待，或者发送大量数据的数据包占用服务器带宽，导致服务器崩溃，还有就是爬虫，密集发送大量请求
 *  还有就是发现哪个页面更耗资源就多次请求这个页面占用服务器带宽，虚构dns,向服务器发送大量的域名解析请求，但是域名是根本不存在的
 */

/**
 * DNS劫持：
 * DNS 的作用是把网络地址域名对应到真实的计算机能够识别的 IP 地址，以便计算机能够进一步通信，传递网址和内容等。如果当用户通过某一个域名访问一个站点的时候，被篡改的 DNS 服务器返回的是一个恶意的钓鱼站点的 IP，用户就被劫持到了恶意钓鱼站点，然后继而会被钓鱼输入各种账号密码信息，泄漏隐私。
 */

/**
 * HTTP 劫持：
 *  HTTP 劫持主要是当用户访问某个站点的时候会经过运营商网络，而不法运营商和黑产勾结能够截获 HTTP 请求返回内容，并且能够篡改内容，然后再返回给用户，从而实现劫持页面，轻则插入小广告，重则直接篡改成钓鱼网站页面骗用户隐私。能够实施流量劫持的根本原因，是 HTTP 协议没有办法对通信对方的身份进行校验以及对数据完整性进行校验。如果能解决这个问题，则流量劫持将无法轻易发生。所以防止 HTTP 劫持的方法只有将内容加密，让劫持者无法破解篡改，这样就可以防止 HTTP 劫持了
 */

/**
 * 服务器漏洞：
 *  越权操作漏洞：比如查看某个用户的信息
 * let msgId = ctx.params.msgId;
   let userId = ctx.session.userId;
 *    mysql.query('SELECT * FROM msg_table WHERE msg_id = ?',[msgId]);//会造成越权漏洞，任何人都能查看，所以一定要带上用户id
      mysql.query('SELECT * FROM msg_table WHERE msg_id = ? AND user_id = ?',[msgId, userId]);
    如果有更严格的权限控制，那在每个请求中凡是涉及到数据库的操作都需要先进行严格的验证，并且在设计数据库表的时候需要考虑进 userId 的账号关联以及权限关联


    目录遍历漏洞：
     目录遍历漏洞指通过在 URL 或参数中构造 ../，./ 和类似的跨父目录字符串的 ASCII 编码、unicode 编码等，完成目录跳转，读取操作系统各个目录下的敏感文件，也可以称作「任意文件读取漏洞」。

        目录遍历漏洞原理：程序没有充分过滤用户输入的 ../ 之类的目录跳转符，导致用户可以通过提交目录跳转来遍历服务器上的任意文件。使用多个.. 符号，不断向上跳转，最终停留在根 /，通过绝对路径去读取任意文件。
        http://somehost.com/../../../../../../../../../etc/passwd
        http://somehost.com/some/path?file=../../Windows/system.ini

        # 借助 %00 空字符截断是一个比较经典的攻击手法
        http://somehost.com/some/path?file=../../Windows/system.ini%00.js

        # 使用了 IIS 的脚本目录来移动目录并执行指令
        http://somehost.com/scripts/..%5c../Windows/System32/cmd.exe?/c+dir+c:\
        防御 方法就是需要对 URL 或者参数进行 ../，./ 等字符的转义过滤。

 */
