const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const proxies = fs.readFileSync('proxies.txt', 'utf-8').trim().split('\n');
  
  // Função para escolher um proxy aleatório
  const getRandomProxy = () => proxies[Math.floor(Math.random() * proxies.length)];
  
  // Função para aguardar um tempo aleatório para simular comportamento humano
  const waitForRandomTime = (min, max) => {
    return new Promise(resolve => {
      const time = Math.floor(Math.random() * (max - min + 1)) + min;
      setTimeout(resolve, time);
    });
  };

  const browser = await puppeteer.launch({
    args: [`--proxy-server=${getRandomProxy()}`, '--no-sandbox'],
    headless: true, // Rodando no modo headless
  });

  const page = await browser.newPage();

  // Acessa o perfil do Clickasnap
  const perfil = 'https://www.clickasnap.com/profile/Yara1212';
  console.log(`Visitando perfil: ${perfil}`);
  await page.goto(perfil, { waitUntil: 'networkidle2' });

  // Aguarda o carregamento do perfil
  await waitForRandomTime(3000, 5000);

  // Coleta os links das fotos
  const photoLinks = await page.$$eval('a[href*="/photo/"]', links =>
    [...new Set(links.map(link => link.href))]
  );

  console.log(`Encontradas ${photoLinks.length} fotos.`);

  for (const link of photoLinks) {
    // Visita cada foto
    console.log(`Visualizando foto: ${link}`);
    await page.goto(link, { waitUntil: 'networkidle2' });

    // Simula ações humanas: curtir, passar para a próxima foto, e voltar
    await waitForRandomTime(5000, 10000);  // Espera entre 5 e 10 segundos para simular leitura

    // Ação de "Curtir" (caso tenha esse botão na página)
    const likeButton = await page.$('button.like-button-selector'); // Você precisa verificar o seletor correto
    if (likeButton) {
      console.log('Curtindo foto...');
      await likeButton.click();
      await waitForRandomTime(2000, 4000); // Espera entre 2 e 4 segundos
    }

    // Passa para a próxima foto ou volta para a anterior
    const nextButton = await page.$('button.next-photo-button-selector'); // Verifique o seletor do botão "próxima foto"
    if (nextButton) {
      console.log('Passando para próxima foto...');
      await nextButton.click();
      await waitForRandomTime(4000, 8000); // Espera entre 4 e 8 segundos
    }

    const backButton = await page.$('button.back-photo-button-selector'); // Verifique o seletor de "voltar"
    if (backButton) {
      console.log('Voltando para foto anterior...');
      await backButton.click();
      await waitForRandomTime(3000, 6000); // Espera entre 3 e 6 segundos
    }

    // Simula pausa entre fotos
    await waitForRandomTime(7000, 10000); // Espera entre 7 e 10 segundos antes de ver a próxima foto
  }

  await browser.close();
})();