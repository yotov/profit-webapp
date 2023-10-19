import { Command, CommandRunner, Option } from 'nest-commander';
import { writeFile } from 'node:fs/promises';
import { parse } from 'date-fns';

interface CommandOptions {
  startTime?: Date;
  startPrice?: number;
  count?: number;
}

function round(value: number, precision = 2): number {
  const res = Math.pow(10, precision);
  return Math.round(value * res) / res;
}

function getRandomPercentageChange(): number {
  const rand = Math.random();
  if (rand < 0.3) {
    return 1;
  } else if (rand < 0.8) {
    return 1 + rand / 1000;
  }
  return 1 - rand / 1000;
}

@Command({
  name: 'generate-price-history',
  description: 'A cli script that generates sample data',
})
export class PriceHistoryCommandModule extends CommandRunner {
  async run(passedParam: string[], options?: CommandOptions): Promise<void> {
    const startTime = (options?.startTime ?? new Date()).setMilliseconds(0);
    const count = options?.count ?? 10_000;
    let price = options?.startPrice ?? 100;

    const content = [...Array(count).keys()]
      .map((i) => {
        price = round(price * getRandomPercentageChange(), 3);
        return `${new Date(startTime + i * 1000).toISOString()},${price}`;
      })
      .join('\n');

    await writeFile('./data/history.csv', content);
  }

  @Option({
    flags: '-c, --count [number]',
    description: 'The count of prices in sample data',
  })
  parseCount(val: string): number {
    return Number(val);
  }

  @Option({
    flags: '-s, --start-price [number]',
    description: 'The starting price of sample data',
  })
  parseStartPrice(val: string): number {
    return Number(val);
  }

  @Option({
    flags: '-d, --start-time [time]',
    description: 'The starting time of sample data ( in "yyyy-MM-dd HH:mm:ss" format )',
  })
  parseStartTime(val: string): Date {
    return parse(val, "yyyy-MM-dd HH:mm:ss", new Date());
  }
}
