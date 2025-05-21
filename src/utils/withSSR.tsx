/**
 * File: src/utils/withSSR.tsx
 * 
 * Utility to add Server-Side Rendering to pages that use context providers
 */

import { GetServerSideProps } from 'next';

/**
 * HOC to add SSR to pages that use context
 * Use this for pages that need to access context providers
 *
 * @example
 * // In your page file:
 * export const getServerSideProps = withSSR();
 * 
 * // If you need additional server-side props:
 * export const getServerSideProps = withSSR(async (context) => {
 *   // Your custom logic here
 *   return { props: { yourCustomProps: 'value' } };
 * });
 */
export function withSSR(
  getServerSidePropsFunc?: GetServerSideProps
): GetServerSideProps {
  return async (context) => {
    // If a custom getServerSideProps function was provided, call it
    if (getServerSidePropsFunc) {
      return await getServerSidePropsFunc(context);
    }

    // Default implementation just returns empty props
    return {
      props: {},
    };
  };
}

export default withSSR;