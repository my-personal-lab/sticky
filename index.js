window.Sticky = (function(jQuery) {

    const Is = {
        IE: function () { return navigator.userAgent.indexOf('Trident/') != -1 },
    };

    const $ = jQuery;

    function transformToJqueryObject(target) {
        return (target instanceof jQuery) ? target : $(target);
    }

    function isEqual(objectTarget, objectReference) {
        return objectTarget === objectReference;
    }

    function getPositionY($target) {
        // Get offset top from target
        const offsetTop = $target.offset().top;

        // Get top from target
        const topPos = Number($target.css('top').replace('px', ''));

        // Calculate final position
        let posY = (offsetTop - topPos);

        // If postY less than zero set offsetTop
        posY = (posY <= 0) ? offsetTop : (offsetTop - topPos);

        return posY;
    }

    return function _Sticky(target, options) {
        // If IE run
        if (!Is.IE()) return false;

        // If jQuery Object?
        const $target = transformToJqueryObject(target);
        const $window = $(window);

        const defaultSettings = {
            className: 'sticky',
            cloneClass: 'sticky-clone',
            context: $target.parent(),
        };

        // Merge options with defaults
        const settings = {
            ...defaultSettings,
            ...options
        };

        // Make object in variables
        const {
            className,
            cloneClass,
            context,
        } = settings;

        // Flux control
        let isReady = false;

        // Clone
        let $clone = $target.clone(true, true);

        // Set clone class
        $clone.addClass(cloneClass);

        // Set clone first width
        $clone.css('width', $target.css('width'));

        // Listeners
        $window.on('scroll', onWindowScroll);
        $window.on('resize', onWindowResize);

        // Binds
        function onWindowScroll() {

            if ($target.is(`.${className}`) && !isReady) {
                // Insert clone into container
                $clone.insertAfter($target);

                // stop statement
                isReady = true;
            } else if ($window.scrollTop() >= getPositionY($target)) {
                $target.addClass(className);
            } else {
                $target.removeClass(className);

                if (isReady) {
                    // Remove clone from container
                    $clone.detach();

                    isReady = false;
                }
            }
        }

        function onWindowResize() {
            forceResize()
        }

        function forceResize() {
            const $stickyClone = $('.sticky-clone');

            if ($stickyClone.length > 0 && isEqual($stickyClone[0], $clone[0])) {
                $stickyClone.css('width', $target.css('width'));
            }
        }

        function init() {
            onWindowScroll();
            onWindowResize();
        }

        init();

        return {
            forceResize
        };
    };
})(jQuery)
