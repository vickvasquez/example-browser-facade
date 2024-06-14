import { App, Runner, PageProcessor } from '@syncmarket/browser-facade'

const selectors = {
  title: 'h1'
}

class ExampleProcessor extends PageProcessor {
  async getData(): Promise<any> {
    const data = await this.page.getTextContent(selectors.title)
    const [title, description] = data.split('\n')

    return { title, description: description.trim() }
  }
}

class ScrapperExample extends Runner<ExampleProcessor> {
  async beforeRun(): Promise<void> {
    this.logger.info('Before run');
  }

  async afterRun(): Promise<void> {
    this.logger.info('After run');
  }

  async run(): Promise<void> {
    try {
      const pageProcessor = await this.process('https://sync-market.netlify.app/')
      const data = await pageProcessor.getData()

      console.log(data)

    } catch (error: any) {
      this.logger.error(error.message);
    }
  }

  async makeResponseProcessor(data: unknown): Promise<ExampleProcessor> {
    return new ExampleProcessor(data);
  }
}

const app = new App({
  navigator: {

  },
  client: {
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  }
})

const scrapper = new ScrapperExample(app)

await scrapper.start()