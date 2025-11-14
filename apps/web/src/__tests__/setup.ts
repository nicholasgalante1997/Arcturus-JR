/// <reference lib="dom" />
/// <reference path="./matchers.d.ts" />
import { GlobalRegistrator } from '@happy-dom/global-registrator';

// Register DOM globals BEFORE any other imports
GlobalRegistrator.register();

import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { afterEach, expect } from 'bun:test';

expect.extend(matchers);

afterEach(cleanup);
