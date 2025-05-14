if(NOT TARGET fbjni::fbjni)
add_library(fbjni::fbjni SHARED IMPORTED)
set_target_properties(fbjni::fbjni PROPERTIES
    IMPORTED_LOCATION "/Users/macbookprom1/.gradle/caches/8.10.2/transforms/f11952b525f3a5e4d0e94e235f377d46/transformed/jetified-fbjni-0.7.0/prefab/modules/fbjni/libs/android.x86/libfbjni.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/macbookprom1/.gradle/caches/8.10.2/transforms/f11952b525f3a5e4d0e94e235f377d46/transformed/jetified-fbjni-0.7.0/prefab/modules/fbjni/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

