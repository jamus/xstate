import { createMachine } from '../src';
import { send } from '../src/actions/send';
import { toSCXMLEvent } from '../src/utils';

describe('action creators', () => {
  describe('send()', () => {
    it('should accept a string event', () => {
      const action = send('foo');
      expect(action.params).toEqual(
        expect.objectContaining({
          to: undefined,
          event: { type: 'foo' },
          delay: undefined,
          id: 'foo'
        })
      );
    });

    it('should accept an event object', () => {
      const action = send({ type: 'foo', bar: 'baz' });
      expect(action.params).toEqual(
        expect.objectContaining({
          to: undefined,
          event: { type: 'foo', bar: 'baz' },
          delay: undefined,
          id: 'foo'
        })
      );
    });

    it('should accept an id option', () => {
      const action = send('foo', { id: 'foo-id' });
      expect(action.params).toEqual(
        expect.objectContaining({
          to: undefined,
          event: { type: 'foo' },
          delay: undefined,
          id: 'foo-id'
        })
      );
    });

    it('should accept a delay option', () => {
      const action = send('foo', { delay: 1000 });
      expect(action.params).toEqual(
        expect.objectContaining({
          to: undefined,
          event: { type: 'foo' },
          delay: 1000,
          id: 'foo'
        })
      );
    });

    it('should accept a delay option (expression)', () => {
      const action = send<
        { delay: number },
        { type: 'EVENT'; value: number } | { type: 'RECEIVED' }
      >('RECEIVED', {
        delay: (ctx, e) => ctx.delay + ('value' in e ? e.value : 0)
      });

      const resolvedAction = action.resolve(
        action,
        { delay: 100 },
        toSCXMLEvent({ type: 'EVENT', value: 50 } as {
          type: 'EVENT';
          value: number;
        }),
        { machine: createMachine({}), state: null as any, action }
      );

      expect(resolvedAction.params.delay).toEqual(150);
    });
  });
});
