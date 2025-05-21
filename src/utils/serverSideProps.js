/**
 * File: src/utils/serverSideProps.js
 * 
 * Utility to easily add server-side rendering to pages
 */

/**
 * Helper to add server-side rendering to any page
 * Use this for pages that need context providers
 * 
 * @param {Function} getPropsFunc Optional function to get additional props
 * @returns {Function} getServerSideProps function for Next.js
 * 
 * @example
 * // Basic usage:
 * export const getServerSideProps = withServerSideProps();
 * 
 * // With custom props:
 * export const getServerSideProps = withServerSideProps(async (context) => {
 *   return {
 *     customProp: 'value'
 *   };
 * });
 */
export function withServerSideProps(getPropsFunc) {
  return async (context) => {
    // Default empty props
    let props = {};
    
    // Call the custom function if provided
    if (typeof getPropsFunc === 'function') {
      try {
        const customProps = await getPropsFunc(context);
        props = { ...props, ...customProps };
      } catch (error) {
        console.error('Error getting custom server-side props:', error);
      }
    }
    
    // Return the props with 10-second revalidation
    return {
      props
    };
  };
}

export default withServerSideProps;