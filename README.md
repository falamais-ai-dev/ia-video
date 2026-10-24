# ia-video

Repositório de configuração das rotinas do canal Pera AI (projeto Videos-IA).

Para que serve: as sessões do Claude na nuvem leem `.claude/settings.json` deste repositório. As regras em `permissions.allow` liberam, sem pedir permissão, os comandos que a rotina de publicação precisa: enviar o video.mp4 ao Litterbox (o Buffer só aceita link público) e chamar a API do Buffer.

Como ativar: copie o conteúdo de `settings-exemplo.json` para um arquivo novo `.claude/settings.json` (na branch main). Vale para as sessões abertas depois disso, enquanto este for o único repositório do projeto.
